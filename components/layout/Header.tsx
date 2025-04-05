export default function Header() {
    return (
      <header className="h-16 bg-background border-b flex items-center px-6 justify-between shadow-sm">
        <h1 className="text-lg font-semibold">Portfolio Overview</h1>
        <div className="flex items-center gap-4">
          {/* You can add notifications, user avatar, etc. */}
          <span className="text-sm text-muted-foreground">Welcome</span>
        </div>
      </header>
    );
  }