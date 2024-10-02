import React from 'react'
import Box from '../pieces/box_user'
export default function Hacks(props){
    const hacks = props.hacks
    console.log(hacks)
    return(
    <section id="user-hacks">
     <div className='container'>
      {hacks ? hacks.map((box,key)=>(
         <Box key={key} id={box.id} api={props.api} cover={box.cover} name={box.h_name} game={box.rom} />
     )):null}   
     </div>
    </section>
    )
}