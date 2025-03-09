import React from "react";
import CardUploadCsv from "components/Cards/CardUploadCsv.js";

export default function UploadCsv({ setRefreshTrigger }) {  // Adding a parameter
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-8/12 px-4">
          <CardUploadCsv setRefreshTrigger={setRefreshTrigger} />  {/* For passing the function*/}
        </div>
      </div>
    </>
  );
}
