const Spinner = ({ size = 24 }) => {
    return (
      <div
        className="animate-spin rounded-full border-2 border-gray-300 border-t-[#89cf07]"
        style={{ width: size, height: size }}
      />
    );
  };
  
  export default Spinner;
  