'use client'

import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="text-xl font-bold ml-4 cursor-pointer" onClick={() => window.location.href = '/'}>Starter</div>
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4 mr-4">
            <NavigationMenuItem>
              <NavigationMenuLink href="/signin" className={navigationMenuTriggerStyle()}>
                Sign In
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
