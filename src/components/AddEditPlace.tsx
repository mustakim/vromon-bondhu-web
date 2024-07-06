import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { addPlace, editPlace } from "../services/firebaseService";
import { IPlace } from "../app/types";
import ImagePicker from "./ImagePicker";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false }); // Dynamically import MapPicker component

const initialFormData: IPlace = {
  id: "",
  name: "",
  description: "",
  popular: false,
  image: [],
  latitude: 23.87929055104281,
  longitude: 90.26813495606596,
  rating: 2.5,
};

const AddPlace: React.FC<{ data?: IPlace }> = ({ data }) => {
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
    const imageUrls = images.map((image) => URL.createObjectURL(image));
    setFormData({
      ...formData,
      image: imageUrls,
    });
  };

  const handleMapChange = (lat: number, lng: number): void => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      if (formData.id) {
        await editPlace(formData.id, JSON.parse(JSON.stringify(formData)));
      } else {
        await addPlace(formData);
      }
      setFormData(initialFormData); // Reset form after submission
    } catch (error) {
      console.error('Error submitting form: ', error);
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
      <MapPicker onChange={handleMapChange} />
      <ImagePicker onImagesSelected={handleImagesSelected} />
      <Button type="submit" variant="contained" color="primary">
        {formData.id ? "Update" : "Submit"}
      </Button>
    </Box>
  );
};

export default AddPlace;
