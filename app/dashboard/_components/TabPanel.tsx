'use client';

import { Tab } from '@headlessui/react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import React from 'react';

interface TabPanelProps {
  tabs: string[];
  children: React.ReactNode[];
  handleApiAction: (action: string) => void;
  result?: any;
}

export function TabPanel({ tabs, children, handleApiAction, result }: TabPanelProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [error, setError] = useState('');

  // Call handleApiAction when tab changes
  useEffect(() => {
    if (tabs[selectedTab]) {
      handleApiAction(tabs[selectedTab]);
    }
  }, [selectedTab, tabs]);

  // Clone children and pass the correct data to them
  const childrenWithProps = React.Children.toArray(children).map((child, index) => {
    if (React.isValidElement(child)) {
      const tabName = tabs[index].toLowerCase();
      return React.cloneElement(child, {
        [tabName]: result?.action === tabs[index] ? result.data : undefined
      });
    }
    return child;
  });

  return (
    <div className="w-full">
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-t-xl bg-gray-100 dark:bg-gray-700 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }: { selected: boolean }) =>
                clsx(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200',
                  'focus:outline-none',
                  selected
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-600/60 hover:text-gray-700 dark:hover:text-gray-300'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {childrenWithProps.map((child, idx) => (
            <Tab.Panel
              key={idx}
              className={clsx(
                'p-6 focus:outline-none'
              )}
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {child}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}