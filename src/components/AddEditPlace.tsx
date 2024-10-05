import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {
  addPlace,
  editPlace,
  uploadImageAndGetURL,
} from "../services/firebaseService";
import { IPlace } from "../app/types";
import ImagePicker from "./ImagePicker";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false }); // Dynamically import MapPicker component

const initialFormData: IPlace = {
  id: "",
  name: "",
  description: "",
  fullDescription: "",
  popular: false,
  image: [],
  latitude: 23.87929055104281,
  longitude: 90.26813495606596,
  rating: 2.5,
};

const AddPlace: React.FC<{ data?: IPlace; onClosePopup: (isClosed: boolean) => void }> = ({
  data,
  onClosePopup,
}) => {
  const [files, setFiles] = useState<File[] | []>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IPlace>(data || initialFormData);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImagesSelected = (images: File[]): void => {
    setFiles(images);
  };

  const handleMapChange = (lat: number, lng: number): void => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
    });
  };

  const uploadFiles = async () => {
    if (files?.length) {
      const urls: string[] = [];
      for (const file of files) {
        await uploadImageAndGetURL(file).then((fileUploadResponse) => {
          urls.push(fileUploadResponse);
        });
      }
      formData.image = await urls;
    } else {
      delete formData.image;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await uploadFiles();
      if (formData.id) {
        await editPlace(formData.id, JSON.parse(JSON.stringify(formData)));
      } else {
        formData.latitude = 23.87929055104281;
        formData.longitude = 90.26813495606596;
        formData.rating = 2.5;
        await addPlace(formData);
      }
      await onClosePopup(true);
      setFormData(initialFormData); // Reset form after submission
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        variant="outlined"
        required
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        variant="outlined"
        multiline
        rows={4}
        required
      />
      <TextField
        label="Full Description for training"
        name="fullDescription"
        value={formData.fullDescription}
        onChange={handleChange}
        variant="outlined"
        multiline
        rows={4}
        required
      />
      <MapPicker onLocationSelect={handleMapChange} />
      <ImagePicker onImagesSelected={handleImagesSelected} />
      <Button type="submit" variant="contained" color="primary">
        {formData.id ? "Update" : "Submit"}
      </Button>
    </Box>
  );
};

export default AddPlace;
