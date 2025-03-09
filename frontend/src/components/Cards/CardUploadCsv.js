import React, { useState } from "react";
import axios from "axios";

export default function CardUploadCsv({ setRefreshTrigger }) {  
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post("http://localhost:9000/api/import-csv", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            console.log("✅ File uploaded successfully!", response.data);
            alert("File uploaded successfully!");

            setRefreshTrigger(prev => prev + 1);  

        } catch (error) {
            console.error("❌ Error uploading file:", error);
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
                <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">Upload CSV File</h6>
                </div>
            </div>

            <div className="flex-auto px-6 py-8">
                <div className="mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Select CSV file
                    </label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full"
                    />
                </div>

                <div className="text-center mt-6">
                    <button
                        className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        onClick={handleUpload}
                    >
                        Upload CSV
                    </button>
                </div>
            </div>
        </div>
    );
}
