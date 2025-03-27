import { useContext, useEffect, useState } from "react";
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'


const Menulist: React.FC = () => {
    const [category,setCategory]=useState("All");
  
  return (
    <div>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category}/>
  </div>
  );
};

export default Menulist;
