// import { uploadImageToR2 } from "../lib/r2";

// async function main() {
//   // A tiny 1x1 red pixel PNG, just to prove upload works
//   const testBuffer = Buffer.from(
//     "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
//     "base64",
//   );

//   // const result = await uploadImageToR2({
//   //   buffer: testBuffer,
//   //   contentType: "image/png",
//   //   key: "test",
//   // });

//   console.log("Upload succeeded:", result);
// }

// main().catch((err) => {
//   console.error("Upload failed:", err);
//   process.exit(1);
// });
