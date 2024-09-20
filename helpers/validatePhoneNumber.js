exports.valPhoneNumber = async (number=null) => {
    try{

    const cleanedNumber = await number.replace(/\D/g, '');

    if (cleanedNumber.length < 10 || cleanedNumber.length > 12) {
        return false;
    }


  const formattedNumber = await cleanedNumber.startsWith('0') ? '62' + cleanedNumber.substring(1): cleanedNumber;
  formattedNumber2 = await formattedNumber+'@c.us';

  return formattedNumber2;


    }catch(err){
        console.log(err);
        return false;
    }
}