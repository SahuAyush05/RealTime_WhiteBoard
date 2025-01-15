import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/sidebar";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
const Landing = () => {
  const tabs = useSelector((state) => state.enable.tabs);
  return (
    <div className="flex flex-col h-[100vh]">
      <div className="h-[8%]">
        <Header />
      </div>

      <div className="flex h-[80%] px-4 my-16 flex-row items-center">
        <Sidebar className="w-[10%]" />
        <div className="w-[90%] pl-[10%] flex justify-center bg-blur-sm ">
          <div
            className={`w-screen fixed top-0 left-0 h-screen ${
              tabs ? "" : "backdrop-blur-sm"
            } bg-gray-400/10 flex justify-center align-middle items-center`}
          >
            <Outlet />
          </div>
        </div>
      </div>
      <div className="h-[8%]">
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
