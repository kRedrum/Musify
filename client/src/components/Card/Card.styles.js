const styles = ({ theme }) => ({
  '& .Card-header': {
    display: 'flex',
    justifyContent: 'space-between'
  },
  '& .Card-body': {
    display: 'block',
    '&--closed': {
      display: 'none'
    }
  }
}
)

export default styles
