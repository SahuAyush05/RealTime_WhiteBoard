import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/sidebar";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
const Landing = () => {
  const tabs = useSelector((state) => state.enable.tabs);

  return (
    <div className={`flex flex-col min-h-screen bg-gray-100`}>
      <header className={`h-[2.8em] bg-gray-200 ${
          tabs ? "":"blur-sm"
        }`}>
        <Header />
      </header>
      <main className={`flex flex-1 items-center relative bg-gray-200 justify-center h-[80%]`}>
        <aside className={`"w-[4%] ml-6 bg-gray-400/10  ${
          tabs ? "":"blur-sm"
        }`}>
          <Sidebar />
        </aside>
        <section className="flex-1  bg-gray-100  overflow-hidden">
          <div
            className={`absolute top-0 left-[6%] w-[94%] h-full flex items-center justify-center`}
          >
            <Outlet />
          </div>
        </section>
      </main>
      <footer className={`h-[8%] bg-gray-100 shadow-md ${
          tabs ? "":"blur-sm"
        }`}>
        <Footer />
      </footer>
      
    </div>
  );
};

export default Landing;
