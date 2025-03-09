import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views
import Dashboard from "views/admin/Dashboard.js";
import Tables from "views/admin/Tables.js";
import UploadCsv from "views/admin/UploadCsv";

export default function Admin() {
  // State to manipulate refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header : Refresh when Updating refreshTrigger */}
        <HeaderStats refreshTrigger={refreshTrigger} />

        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard" exact>
              <Dashboard setRefreshTrigger={setRefreshTrigger} />
            </Route>
            <Route path="/admin/tables" exact component={Tables} />
            <Route path="/admin/uploadcsv" exact>
              <UploadCsv setRefreshTrigger={setRefreshTrigger} />
            </Route>

            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
