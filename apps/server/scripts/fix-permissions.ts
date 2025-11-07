import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Ellenőrizzük az admin jogosultságokat...');

  // Get admin user
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@mbit.hu' },
    include: {
      roles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!adminUser) {
    console.error('❌ Admin felhasználó nem található!');
    return;
  }

  console.log(`✅ Admin felhasználó: ${adminUser.email}`);
  console.log(`   Szerepkörök: ${adminUser.roles.length}`);

  for (const userRole of adminUser.roles) {
    console.log(`\n📋 Szerepkör: ${userRole.role.nev}`);
    console.log(`   Jogosultságok: ${userRole.role.rolePermissions.length}`);
    
    // Check if CUSTOMER_CREATE permission exists
    const hasCustomerCreate = userRole.role.rolePermissions.some(
      rp => rp.permission.kod === 'customer:create'
    );
    
    console.log(`   CUSTOMER_CREATE jogosultság: ${hasCustomerCreate ? '✅' : '❌'}`);
    
    if (!hasCustomerCreate) {
      console.log('   🔧 CUSTOMER_CREATE jogosultság hozzáadása...');
      
      // Find the permission
      const customerCreatePerm = await prisma.permission.findUnique({
        where: { kod: 'customer:create' },
      });
      
      if (customerCreatePerm) {
        await prisma.rolePermission.create({
          data: {
            roleId: userRole.role.id,
            permissionId: customerCreatePerm.id,
          },
        });
        console.log('   ✅ Jogosultság hozzáadva');
      } else {
        console.log('   ❌ CUSTOMER_CREATE permission nem található az adatbázisban!');
      }
    }
  }

  // Verify final state
  console.log('\n🔍 Végleges állapot ellenőrzése...');
  const updatedUser = await prisma.user.findUnique({
    where: { email: 'admin@mbit.hu' },
    include: {
      roles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const allPermissions = new Set<string>();
  for (const userRole of updatedUser!.roles) {
    for (const rp of userRole.role.rolePermissions) {
      allPermissions.add(rp.permission.kod);
    }
  }

  console.log(`\n✅ Admin felhasználó összes jogosultsága: ${allPermissions.size}`);
  console.log(`   CRM jogosultságok:`);
  Array.from(allPermissions)
    .filter(p => p.startsWith('customer:') || p.startsWith('crm:'))
    .forEach(p => console.log(`     - ${p}`));
}

main()
  .catch((e) => {
    console.error('❌ Hiba:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
