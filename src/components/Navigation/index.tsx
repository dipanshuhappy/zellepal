'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Bank, Home, User } from 'iconoir-react';

/**
 * This component uses the UI Kit to navigate between pages
 * Bottom navigation is the most common navigation pattern in Mini Apps
 * We require mobile first design patterns for mini apps
 * Read More: https://docs.world.org/mini-apps/design/app-guidelines#mobile-first
 */

export const Navigation = ({ value, setValue }: { value: string; setValue: (v: string) => void }) => {
  return (
    <div className="sticky bottom-0 left-0 w-full z-30 bg-background border-t border-gray-200 px-2 py-1 sm:px-4 sm:py-2">
      <Tabs value={value} onValueChange={setValue} className="w-full">
        <TabItem value="home" icon={<Home />} label="Home" />
        {/* // TODO: These currently don't link anywhere */}
        <TabItem value="wallet" icon={<Bank />} label="Wallet" />
        {/* <TabItem value="profile" icon={<User />} label="Profile" /> */}
      </Tabs>
    </div>
  );
};
