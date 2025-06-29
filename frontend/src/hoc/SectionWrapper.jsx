import { motion } from "framer-motion";


const StarWrapper = (Component, idName) =>
  function HOC() {
    return (
      <motion.section
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.25 }}
      >
        <span className='hash-span' id={idName}>
          &nbsp;
        </span>
        <Component />
      </motion.section>
    );
  };

export default StarWrapper;
