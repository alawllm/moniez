import { useState } from "react";
import { useContext } from "react";

import { RecordsContext } from "../../../contexts/records.context";
import { UserContext } from "../../../contexts/user.context";
import { addRecord } from "../../../firebase_config/firestore-records.config";
import { getDocuments } from "../../../firebase_config/firestore-records.config";
import Button from "../button/button.component";
import DropdownCategories from "../dropdown/dropdown.component";
import FormInput from "../form-input/form-input.component";

const defaultRecord = {
  category: "clothes",
  date: "",
  item: "",
  price: 0,
};

const categoriesList = ["clothes", "food", "education", "household", "travel"];

const AddRecords = () => {
  const [record, setRecord] = useState(defaultRecord);
  const [message, setMessage] = useState({ error: false, msg: "" });
  const { category, item, price, date } = record;

  //id of the current user
  const { uid } = useContext(UserContext);

  const { setRecords } = useContext(RecordsContext);

  const resetRecord = () => {
    setRecord(defaultRecord);
  };

  const handleChange = (event) => {
    //target gives the input
    const { name, value } = event.target;

    setRecord({ ...record, [name]: value });
  };

  //update the map every time a new record has been added
  const handleRecordAddition = async (newRecord) => {
    await addRecord(newRecord);
    //get documents of the current user
    const updatedRecords = await getDocuments(uid);
    setRecords(updatedRecords);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      record.item === "" ||
      record.price <= 0 ||
      record.date === "dd.mm.yyyy"
    ) {
      setMessage({ error: true, msg: "All fields are mandatory" });
    } else {
      try {
        const newRecord = {
          category: record.category,
          date: record.date,
          item: record.item,
          price: record.price,
          uid: uid,
        };
        //updating entry in the firestore
        //takes id and updated record
        handleRecordAddition(newRecord);
        setMessage({ error: false, msg: "Added succesfully" });
      } catch (err) {
        setMessage({ error: true, msg: "an error occured" });
        console.log(err);
      }
    }
    resetRecord();
  };

  return (
    <div className="m-10 text-center flex flex-col justify-start">
      <h1 className="text-center font-bold text-2xl text-blue-700 mb-5">
        Add records
      </h1>
      {message && (
        <>
          <span className="text-sky-500 text-center">{message.msg}</span>
        </>
      )}
      <form
        className="flex flex-col items-center rounded px-8"
        onSubmit={handleSubmit}>
        <DropdownCategories
          required
          name="category"
          label="category"
          value={category}
          categoryOptions={categoriesList}
          onChange={handleChange}
        />
        <FormInput
          required
          type="text"
          label="item"
          name="item"
          value={item}
          placeholder="item"
          onChange={handleChange}
        />
        <FormInput
          required
          type="number"
          label="price"
          name="price"
          value={price}
          placeholder="0"
          onChange={handleChange}
        />
        <FormInput
          required
          type="date"
          label="date"
          name="date"
          value={date}
          onChange={handleChange}
        />
        <div className="flex flex-col">
          <Button type="submit" >+</Button>
        </div>
      </form>
    </div>
  );
};

export default AddRecords;
