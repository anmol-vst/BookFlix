function calculateFine(dueDate){
  const today = new Date();
    if(today>dueDate){
      late = today-dueDate;
      return late*10
    }
  }
  module.exports = {calculateFine}