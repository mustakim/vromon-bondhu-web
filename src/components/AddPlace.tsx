import React, { useState, ChangeEvent, FormEvent } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { addPlace } from "../services/firebaseService";
import { IPlace } from "../app/types";
import ImagePicker from "./ImagePicker";
import MapPicker from "./MapPicker";

const initialFormData: IPlace = {
  name: "",
  description: "",
  popular: false,
  image: [],
  latitude: 23.87929055104281,
  longitude: 90.26813495606596,
  rating: 2.5,
};

const AddPlace: React.FC = () => {
  const [formData, setFormData] = useState<IPlace>(initialFormData);

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
      await addPlace(formData);
      setFormData({ name: "", description: "" });
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
      <MapPicker onChange={handleMapChange} />
      <ImagePicker onImagesSelected={handleImagesSelected} />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default AddPlace;
