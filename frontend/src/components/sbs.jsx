
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { Selections } from "../constants";
import { useNavigate } from "react-router-dom";

const SBS = () => {
  const navigate = useNavigate();
  const handleClick = (id,name) => {
    navigate(`/landingPage/${id}/${encodeURIComponent(name)}`);
  }

  return (
    <div className='flex flex-row flex-wrap justify-center gap-10'>
      {Selections.map((val) => (
        <div className='w-28 h-28 balls' key={val.name} onClick={() => handleClick(val.id,val.name)}>
          <BallCanvas icon={val.icon}  />
        </div>
      ))}
    </div>
  );
};

export default SectionWrapper(SBS, "");
