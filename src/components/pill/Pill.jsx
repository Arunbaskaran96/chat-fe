import classes from "./pill.module.css";
import { MdCancel } from "react-icons/md";

export default function Pill({ item, deleteUser }) {
  return (
    <div className={classes.container}>
      <p className={classes.name}>{item.name}</p>
      {deleteUser && (
        <MdCancel
          onClick={() => deleteUser(item)}
          style={{ cursor: "pointer" }}
        />
      )}
    </div>
  );
}
