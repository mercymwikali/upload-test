import type { MetaFunction } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import { useNetworkState } from "@uidotdev/usehooks";
import { useCallback, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { MdOutlineCloudUpload } from "react-icons/md";
import { IoLogoDropbox } from "react-icons/io5";
import { FaGoogleDrive } from "react-icons/fa6";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [file, setFile] = useState<File | undefined>();
  const [fileBlob, setFileBlob] = useState<string | undefined>();

  const submitFile = useSubmit();

  // File upload simulation
  const uploadFile = async (file: File, simulation: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  
    const toastMessages: { [key: string]: string } = {
      success: "Upload succeeded",
      fail: "Upload fail",
      cancel: "Upload cancel",
      pause: "Upload pause",
      error: "Upload error",
    };
  
    const message = toastMessages[simulation] || toastMessages.error;
    const toastType = simulation === "success" ? "success" : "error";
  
    toast[toastType](message, { autoClose: 2000 });
  };
  

  // Callback function for network error connection
  const onFinish = useCallback(async (values: any) => {
    // Use network state hook for network error
    const network = useNetworkState();
    if (!network.online) {
      toast.error("Network error", { autoClose: 2000 });
      return;
    }

    const { image } = values;
    if (!image || !image.file) {
      toast.error("No image selected", { autoClose: 2000 });
      return;
    }

    const file = image.file;

    const formData = new FormData();
    formData.append("picture", file);
    try {
      const response = await fetch("http://localhost:3000/uploads", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        toast.error("Upload failed to server", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(`Upload failed: ${error}`, {
        autoClose: 2000,
      });
    }
  }, []);

  return (
    <div className="flex font-raleway justify-center items-center h-screen">
      <div className="mx-auto p-6 bg-white shadow-md rounded-3xl h-[50%] w-[70%]">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-raleway font-bold text-orange">
            Upload a property photo
          </h1>
          <span className="text-xls text-dark font-raleway font-medium w-[38%]">
            First impressions matter. Choose a photo that best represents your
            property.
          </span>
        </div>
        <Form method="post" encType="multipart/form-data" action="/uploads">
          <label
            className={`cursor-pointer mt-6 bg-transparent w-full h-[80%] gap-[10px] flex flex-col justify-center items-center font-bold rounded-2xl border-neutral relative`}
            htmlFor="Picture"
          >
            <input
              id="Picture"
              type="file"
              hidden
              onChange={async e => {
                const file = e.currentTarget.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  setFile(file)
                  reader.onload = event => {
                    setFileBlob(event.target?.result?.toString() ?? undefined)
                  }
                  try {
                    // Call onFinish function with the selected image
                    await onFinish({ image: { file } })
                  } catch (error) {
                    console.error("Error while processing image:", error)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
            <MdOutlineCloudUpload size={50} />

            <div className="flex gap-x-12 py-4">
              <div className="px-8 py-4 shadow-md rounded-3xl ] shadow-gray-light">
                <p className="text-orange text-3xl font-raleway italic font-medium">
                  Keeps
                </p>
              </div>
              <div className="px-8 py-4 shadow-md rounded-3xl ] shadow-gray-light">
                <FaGoogleDrive size={50} />
              </div>
              <div className="px-8 py-4 shadow-md rounded-3xl ] shadow-gray-light">
                <IoLogoDropbox size={50} />
              </div>
            </div>
            
            <img src={fileBlob} className="w-full h-full mt-2 rounded-2xl" />

          </label>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
}
