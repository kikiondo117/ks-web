// import { User } from "@prisma/client";
import { Form } from "@remix-run/react";
import { useState } from "react";

import { createCourseSchema } from "~/utils/zod";

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
