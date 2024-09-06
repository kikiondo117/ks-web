// import { User } from "@prisma/client";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useState } from "react";
import resizeImg from "resize-img";
import { uploadImage } from "~/utils/s3";

import { createCourseSchema } from "~/utils/zod";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const imageFile = formData.get("image"); // Los archivos en el HTML se manejan como blob
  const MAX_SIZE_IN_BYTES = 5 * 1024 * 1024; // 2MB

  console.log("imageFile", imageFile);

  if (!imageFile || typeof imageFile === "string") {
    return json(
      { ok: false, error: "Image file is required" },
      { status: 400 }
    );
  }
  // De blob lo transformamos a un Buffer para que node lo pueda modificar
  /*
   Toma el ArrayBuffer y lo convierte a un Buffer de Node.js. 
   El Buffer es el formato nativo de Node.js para trabajar con datos binarios,
   por lo que es necesario hacer esta conversión para subir el archivo a AWS S3 o manipularlo en otros procesos del servidor.
   */
  const fileBuffer = Buffer.from(await imageFile.arrayBuffer()); // Convertir a buffer directamente

  if (fileBuffer.length > MAX_SIZE_IN_BYTES) {
    return json(
      { error: "La imagen excede el tamaño máximo permitido de 5MB." },
      { status: 400 }
    );
  }

  // Redimensionar la imagen
  const resizedImage = await resizeImg(fileBuffer, {
    width: 200,
    height: 200,
  });

  const imageResponse = await uploadImage({ imageFile, image: resizedImage });
  console.log("imageResponse", imageResponse);

  return json({ ok: true, message: "Course created succefully " });
};

export default function CreateCourse() {
  // const { user }: { user: User } = useOutletContext();
  const [isPaid, setIsPaid] = useState(true);
  const [preview, setPreview] = useState("");
  const stringToBoolean = (str: string) => str === "true";

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Crea una URL temporal - url de objeto, que representa el archivo seleccionado
      // Permite que sea accesible localmente en el navegador sin subirlo a un server
      // Util para previsualizar
      setPreview(window.URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl">Create course</h1>

      <Form
        method="POST"
        className="max-w-screen-sm w-screen-sm flex flex-col gap-4"
        encType="multipart/form-data"
      >
        <div className="flex flex-col gap-4">
          <label htmlFor="name">Nombre del curso 🧙‍♂️</label>
          <input
            className=" border px-4 py-2 rounded focus:border-blue-500"
            type="text"
            id="name"
            name="name"
          />
          {/* {formik.errors.name && (
            <span className="text-red-500">{formik.errors.name}</span>
          )} */}
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="description">Descripcion del curso:</label>
          <textarea
            className=" border px-4 py-2 rounded focus:border-blue-500"
            name="description"
            id="description"
            cols={7}
            rows={7}
          ></textarea>
          {/* {formik.errors.description && (
            <span className="text-red-500">{formik.errors.description}</span>
          )} */}
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="paid">Paid:</label>
          <select
            onChange={(event) => setIsPaid(stringToBoolean(event.target.value))}
            name="paid"
            id="paid"
            className=" border px-4 py-2 rounded focus:border-blue-500"
          >
            <option value="true">Paid</option>
            <option value="false">Free</option>
          </select>
          {/* {formik.errors.paid && (
            <span className="text-red-500">{formik.errors.paid}</span>
          )} */}
        </div>

        {isPaid && (
          <div className="flex flex-col gap-4">
            <label htmlFor="paid">Price:</label>
            <input
              type="number"
              className=" border px-4 py-2 rounded focus:border-blue-500"
            />
            {/* {formik.errors.paid && (
            <span className="text-red-500">{formik.errors.paid}</span>
          )} */}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <label htmlFor="image">Agrega la imagen de tu curso</label>
          <input
            onChange={handleImage}
            type="file"
            name="image"
            accept="image/*"
          />
        </div>

        {preview && (
          <div className="max-w-xs">
            <img src={preview} alt="preview" />
          </div>
        )}

        <button type="submit">Crear curso</button>
      </Form>
    </div>
  );
}
