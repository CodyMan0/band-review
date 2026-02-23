'use client';

import { Drawer } from 'vaul';

import { cn } from './lib/utils';

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onOpenChange, children, className }: BottomSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/30" />
        <Drawer.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-[540px] flex-col rounded-t-2xl bg-background px-5 pb-8 pt-5 shadow-xl outline-none',
            className,
          )}
        >
          <Drawer.Handle className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
