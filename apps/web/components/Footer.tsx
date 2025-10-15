import { Code2, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black py-5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-xs hover:underline text-white">litecode</span>
          </div>
          <div className="flex space-x-6 text-xs">
            <a
              href="https://github.com/VijayRavichander"
              target="_blank"
              className="text-gray-400 hover:text-white transition"
            >
              <Github className="h-4 w-4" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
