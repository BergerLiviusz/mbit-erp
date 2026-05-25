interface CategoryNode {
  id: string;
  nev: string;
  parentId?: string | null;
  children?: CategoryNode[];
}

function flatten(nodes: CategoryNode[], depth = 0): Array<{ id: string; label: string }> {
  const out: Array<{ id: string; label: string }> = [];
  for (const n of nodes) {
    out.push({ id: n.id, label: `${'— '.repeat(depth)}${n.nev}` });
    if (n.children?.length) out.push(...flatten(n.children, depth + 1));
  }
  return out;
}

export default function CategoryTreeSelect({
  value,
  onChange,
  categories,
  allowEmpty = true,
  className = '',
}: {
  value: string;
  onChange: (id: string) => void;
  categories: CategoryNode[];
  allowEmpty?: boolean;
  className?: string;
}) {
  const options = flatten(categories);

  return (
    <select
      className={className || 'w-full border rounded px-2 py-1'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {allowEmpty && <option value="">— Nincs kategória —</option>}
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
