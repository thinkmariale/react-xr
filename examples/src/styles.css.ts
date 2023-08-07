import { style, globalStyle } from '@vanilla-extract/css'

export const page = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  maxWidth: '100vw',
  maxHeight: '100vh'
})

export const demoPanel = style({
  zIndex: 1000,
  position: 'absolute',
  padding:'10px',
  top: '70px',
  left: '50px',
  right: '60px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor:'rgba(50, 51, 56,.96)',
  borderRadius:'10px',
  color:'#fff',
  fontFamily: "'Roboto', sans-serif",
})
export const codePanel = style({
  backgroundColor:'rgba(100, 101, 110,.4)',
  padding:'5px',
  margin:'auto',
  width:'90%',
  height:'80px',
  borderRadius:'10px'
})

export const modalTitle = style({
  padding:'10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  color:'#fff'
})

export const demoImage = style({
  width:'40px',
  margin:'auto',
 })
 
 


