import "./config/init";
import app from "./app";

app.listen(8088, () => {
  console.log(`Example app listening on port ${8088}`);
});
