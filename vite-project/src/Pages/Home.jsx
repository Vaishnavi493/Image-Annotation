import { useState } from "react";
import ImageUpload from "./Components/image/Imageupload";
import Stages from "./Components/Drawing/Stages";
import Options from "./Components/Drawing/Options";

function Home() {
  const [imageSrcs, setImageSrcs] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [annotations, setAnnotations] = useState({});
  const [color, setColor] = useState("#000000");
  const [action, setAction] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleBack = () => {
    setSelectedImage(null);
  };

  const handleAnnotationUpdate = (image, newAnnotations) => {
    setAnnotations((prevAnnotations) => ({
      ...prevAnnotations,
      [image.src]: newAnnotations,
    }));
  };

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gradient-to-t from-purple-900 to-slate-900">
      {!selectedImage ? (
        <>
          <ImageUpload setImageSrc={setImageSrcs} />
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {imageSrcs.map((image, index) => (
              <div key={index} onClick={() => handleImageClick(image)}>
                <img
                  src={image.src}
                  alt={`Uploaded ${index}`}
                  className="w-32 h-32 object-cover cursor-pointer"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-full"
          >
            Back to Images
          </button>
          <Options color={color} setColor={setColor} setAction={setAction} action={action} />
          <Stages 
            imageSrc={selectedImage} 
            action={action} 
            color={color} 
            annotations={annotations[selectedImage.src] || []}
            onAnnotationUpdate={(newAnnotations) => handleAnnotationUpdate(selectedImage, newAnnotations)}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
