function Imageupload({ setImageSrc }) {
    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      const images=[];
      files.forEach((file)=>{
        const reader = new FileReader();
        reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload=()=>{
            images.push({
                src:img.src,
                width:img.width,
                height:img.height,
            });
        if(images.length==files.length){
            setImageSrc(images);
            images.forEach(image=>console.log(image.height,image.width));

        }
        };
        };
        reader.readAsDataURL(file);
      });
     
    };
  
    return (
      <>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="mb-4 file:px-3 file:py-2 file:rounded-full file:bg-blue-600 file:border-none file:text-white file:cursor-pointer bg-slate-500 px-3 py-2 rounded-full text-white/80  "
          placeholder="dad"
        />
      </>
    );
  }
  
  export default Imageupload;
  