import { useState, useEffect, useRef, type ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const BottomSheet = ({
  isOpen,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClose,
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  title
}: BottomSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [sheetHeight, setSheetHeight] = useState(0); 
  
  // State for vertical position (translateY)
  // 0 = Fully Expanded (Top)
  // sheetHeight - PEEK_HEIGHT = Peek (Bottom)
  // sheetHeight + buffer = Closed (Off screen)
  const [translateY, setTranslateY] = useState(1000); 
  const [isDragging, setIsDragging] = useState(false);
  
  const startY = useRef(0);
  const startTranslateY = useRef(0);
  const isClick = useRef(true); // Track if the interaction was just a click
  
  // Constants
  const PEEK_HEIGHT = 120; // Height of the "peek" area

  // Measure sheet height on mount/resize
  useEffect(() => {
    const updateHeight = () => {
        const vh = window.innerHeight;
        const maxH = vh * 0.85; 
        setSheetHeight(maxH);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Sync isOpen prop with transform state
  useEffect(() => {
    if (sheetHeight === 0) return;

    if (isOpen) {
      // Default to Peek when opening
      if (translateY >= sheetHeight) {
          const peekY = sheetHeight - PEEK_HEIGHT;
          setTranslateY(peekY);
      }
    } else {
       // Slide off-screen
       setTranslateY(sheetHeight + 50); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sheetHeight]);

  // --- Pointer Handlers (Mouse & Touch unified) ---

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    isClick.current = true; // Assume click initially
    startY.current = e.clientY;
    startTranslateY.current = translateY;
    
    // Capture pointer to track dragging even if mouse leaves the element bounds
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const currentY = e.clientY;
    const deltaY = currentY - startY.current;
    
    // If moved more than 5px, it's a drag, not a click
    if (Math.abs(deltaY) > 5) {
      isClick.current = false;
    }

    const newY = startTranslateY.current + deltaY;
    
    // Clamp values (Min: 0, Max: sheetHeight)
    if (newY >= 0) {
        setTranslateY(newY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
    
    const peekY = sheetHeight - PEEK_HEIGHT;
    
    // 1. Handle Click (Tap to Toggle)
    if (isClick.current) {
      // If we are currently near the bottom (Peek), expand to Top
      if (Math.abs(translateY - peekY) < 50) {
        setTranslateY(0);
      } 
      // If we are near the top (Expanded), collapse to Peek
      else {
        setTranslateY(peekY);
      }
      return;
    }

    // 2. Handle Drag Snap
    const midpoint = peekY / 2;
    
    if (translateY < midpoint) {
        setTranslateY(0); // Snap to Expanded
    } else {
        setTranslateY(peekY); // Snap to Peek
    }
  };

  if (!isOpen && translateY >= sheetHeight) return null;

  return (
    <>
      <div 
         className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none flex flex-col justify-end"
         style={{ height: '100vh' }}
      >
        <div
          ref={sheetRef}
          className={`
            w-full bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-gray-100
            pointer-events-auto
            ${isDragging ? '' : 'transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]'}
          `}
          style={{ 
            height: '85vh', 
            transform: `translateY(${translateY}px)` 
          }}
        >
          {/* 
             Drag Handle / Header Area 
             Uses Pointer Events for Mouse/Touch support
             touch-action: none prevents browser scrolling while dragging
          */}
          <div 
             className="w-full pt-3 pb-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing bg-white rounded-t-3xl"
             style={{ touchAction: 'none' }} 
             onPointerDown={handlePointerDown}
             onPointerMove={handlePointerMove}
             onPointerUp={handlePointerUp}
             onPointerCancel={handlePointerUp}
          >
             {/* Handle Bar */}
             <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-1" />
          </div>

          {/* Content Area */}
          <div className="h-full overflow-y-auto bg-white">
             {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomSheet;