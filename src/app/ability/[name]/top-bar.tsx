interface TopBarProps {
  name: string | null
  index: string | null
}

function TopBar({ name, index }: TopBarProps) {
  return (
    <div className="border-b border-b-muted px-4 pb-2 pt-4 font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
      <h1 className="flex justify-between font-bold">
        <span>{name}</span>
        <span>
          #
          {index}
        </span>
      </h1>
    </div>
  )
}

export default TopBar
