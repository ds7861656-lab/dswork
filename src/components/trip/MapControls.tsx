import { 
  PlusIcon, 
  MinusIcon, 
  MapIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onMapTypeToggle?: () => void;
  onFullscreen?: () => void;
}

const MapControls = ({
  onZoomIn,
  onZoomOut,
  onMapTypeToggle,
  onFullscreen
}: MapControlsProps) => {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={onZoomIn}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 smooth-transition border-b border-gray-200"
          aria-label="Zoom in"
        >
          <PlusIcon className="h-5 w-5 text-gray-700" />
        </button>
        <button
          onClick={onZoomOut}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 smooth-transition"
          aria-label="Zoom out"
        >
          <MinusIcon className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Map Type Toggle */}
      {onMapTypeToggle && (
        <button
          onClick={onMapTypeToggle}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-100 smooth-transition"
          aria-label="Toggle map type"
        >
          <MapIcon className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {/* Fullscreen Toggle */}
      {onFullscreen && (
        <button
          onClick={onFullscreen}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-100 smooth-transition"
          aria-label="Toggle fullscreen"
        >
          <ArrowsPointingOutIcon className="h-5 w-5 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default MapControls;