import { Loader2 } from "lucide-react";


const Loader = ({color}: {color: string}) => {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          {/* Outer glow effect */}
          <div className={`absolute inset-0 bg-${color}-600/30 blur-xl rounded-full animate-pulse`}></div>
          
          {/* Main loader container */}
          <div className={`relative bg-black/80 p-8 rounded-2xl border border-${color}-500/30 backdrop-blur-sm shadow-xl flex flex-col items-center`}>
            <Loader2 className={`w-12 h-12 text-${color}-500 animate-spin`}/>
            
            {/* Loading text */}
            <p className={`mt-4 text-white text-${color}-300 font-medium tracking-wider text-sm animate-pulse`}>
              LOADING
            </p>
          </div>
        </div>
      </div>
      );
}

export default Loader;