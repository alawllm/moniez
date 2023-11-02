import { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import { RecordsContext } from "../../../contexts/records.context";
import { UserContext } from "../../../contexts/user.context";
import {
  deleteRecord,
  getAllRecordsData,
  updateRecord,
} from "../../../firebase_config/firestore-methods.config";
import ModalUpdate from "../../helper-components/modal-update/modal-update.component";
import TableHeader from "../../helper-components/table-header/table-header.component";
import TableRow from "../../helper-components/table-row/table-row.component";

const TableAllRecords = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [clickedRecord, setClickedRecord] = useState({});

  //informations out of the context
  const { allRecords, setAllRecords } = useContext(RecordsContext);
  const { uid } = useContext(UserContext);

  const isSmallScreen = useMediaQuery({ maxWidth: 750 });

  const calculateTotalPrice = (records) => {
    const totalPrice = records.reduce(
      (sum, item) => sum + Number(item.price),
      0,
    );
    const numItems = records.length;
    console.log(numItems);
    const summary = {
      totalPrice: totalPrice,
      numItems: numItems,
    };
    return summary;
  };
  const summary = calculateTotalPrice(allRecords);

  const getUpdatedAndSetState = async (uid) => {
    const updatedRecords = await getAllRecordsData(uid);
    setAllRecords(updatedRecords);
  };

  const handleClickUpdate = async (clickedRecord) => {
    setIsModalOpen(true);
    setClickedRecord(clickedRecord);
  };

  const handleUpdate = async (updatedRecord) => {
    if (!clickedRecord) {
      return;
    }
    await updateRecord(updatedRecord.id, updatedRecord);
    setClickedRecord(null);
  };

  const handleDeleteAndUpdate = async (id) => {
    await deleteRecord(id);
    await getUpdatedAndSetState(uid);
    setIsDeleted(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const updateRec = async () => {
      const updatedRecords = await getAllRecordsData(uid);
      setAllRecords(updatedRecords);
    };
    updateRec();
  }, [setAllRecords, uid]);

  //handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".text-sky-500")) {
        setIsDeleted(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="m-10 flex h-full flex-col justify-start text-center">
        {allRecords.length === 0 ? (
          <p className="mt-12 text-2xl text-yellow-600">
            Sorry, no records yet.
          </p>
        ) : (
          <>
            <p className="mb-4 text-center text-xl text-green-700">
              spent {summary.totalPrice} € on {summary.numItems} items
            </p>
            {/* here input for filtering  */}
            <table className="table-auto">
              <thead>
                <tr>
                  <TableHeader
                    text={isSmallScreen ? "Cat" : "Category"}
                    textColor="text-black"
                  />
                  <TableHeader text="Item" textColor="text-gray-800" />
                  <TableHeader text="Price" textColor="text-gray-800" />
                  <TableHeader text="Date" textColor="text-gray-800" />
                  <TableHeader text="Edit" textColor="text-blue-700" />
                  <TableHeader
                    text={isSmallScreen ? "Del" : "Delete"}
                    textColor="text-blue-700"
                  />
                </tr>
              </thead>
              <tbody>
                {allRecords.map((record) => (
                  <TableRow
                    key={record.id}
                    record={record}
                    handleClickUpdate={handleClickUpdate}
                    handleDeleteAndUpdate={handleDeleteAndUpdate}
                  />
                ))}
              </tbody>
            </table>
          </>
        )}
        {isDeleted ? (
          <p className="mt-4 text-left text-base text-red-500">
            Succesfully deleted.
          </p>
        ) : (
          ""
        )}
        {isModalOpen && (
          <>
            <ModalUpdate
              clickedRecord={clickedRecord}
              handleUpdate={handleUpdate}
              closeModal={closeModal}
              isModalOpen={isModalOpen}
            />
          </>
        )}
      </div>
    </>
  );
};

export default TableAllRecords;
