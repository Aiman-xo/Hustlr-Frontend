import EmployerSidebar from "./sidebar/EmployerSidebar";
import { Outlet } from "react-router-dom";

const EmployerLayout = () => {
    return (
      <div className="flex bg-[#f7f8f5]">
        <EmployerSidebar />
        <main className="flex-1 h-screen overflow-y-auto">
          <Outlet /> 
        </main>
      </div>
    );
  };
  
  export default EmployerLayout;