import app from "../src/index";

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// const body: Record<string, unknown> = {
  //   model: params.model,
  //   prompt: params.prompt,
  // };
  // if (params.resolution) body.resolution = params.resolution;
  // if (params.aspectRatio) body.aspect_ratio = params.aspectRatio;
  // if (params.references && params.references.length > 0) {
  //   body.input_references = params.references.map((ref) => ({
  //     type: "image_url",
  //     image_url: { url: ref.url },
  //   }));
  // }