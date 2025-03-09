import React from "react";
import CardUploadCsv from "components/Cards/CardUploadCsv.js";

export default function UploadCsv({ setRefreshTrigger }) {  // 👈 Ajout du paramètre
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-8/12 px-4">
          <CardUploadCsv setRefreshTrigger={setRefreshTrigger} />  {/* 👈 Passer la fonction */}
        </div>
      </div>
    </>
  );
}
