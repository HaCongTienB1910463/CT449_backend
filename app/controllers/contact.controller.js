const ContactService=require("../services/contact.service");
const MongoBD= require("../utils/mongodb.util");
const ApiError= require("../api-error");


//create and save a new contact
exports.create =  async(req,res,next)=>{
    if(!req.body.name){
        return next(new ApiError(400,"Name can not be empty"));
    }
    try{
        const contactService= new ContactService(MongoBD.client);
        document=await contactService.create(req.body);
        
        return res.send(document);
    }catch(error){
        return next(
            new ApiError( 500, "An error occurred while creating the contact")
        );
    }
};
exports.findAll = async(req,res,next) => {
    let documents=[];
    try {
        const contactService= new ContactService(MongoBD.client);
        const{name}=req.query;
        if(name){
            documents=await contactService.findByName(name);
        }else{ 
            documents=await contactService.find({});
             }
    }catch (error){
        return next(
            new ApiError(500,"An error occurred while retrieving contacts")
        );
    }

    res.send (documents);
};

exports.findOne = async(req,res,next) => {
    try{
        const contactService= new ContactService(MongoBD.client);
        const document= await contactService.findById(req.params.id);
        if(!document){
            return next(new ApiError(404,"contact not found"));
        }
        return res.send(document);
    }catch(error){
        return next( new ApiError (500,`Error rtrieving contact with id=${req.params.id}`
        )
        );
    };
};

exports.update = async(req,res,next) => {
    if(Object.keys(req.body).length===0){
        return next(new ApiError(400,"Data to updata can not be empty"));
    }
    try{
        const contactService= new ContactService(MongoBD.client);
        const document=await contactService.update(req.params.id,req.body);
        if(!document){
            return next (new ApiError(404,"contact not found"));
        }
        return res.send({message:"contact was updated successfully"});
    }
    catch(error){
        return next(new ApiError(500,`Error updating contact with id=${req.params.id}`));
    }
};

exports.delete = async (req,res,next) => {
   try{
    const contactService= new ContactService(MongoBD.client);
    const document= await contactService.delete(req.params.id);
    if(!document){
        return next(new ApiError(404,"contact not found"));
    }
    return res.send({message:"contact was deleted successfully"});
   }catch(error){
    return next(new ApiError(500, `could not delete contact with id=${req.params.id}`));
   }
};

exports.deleteAll = async(req,res,next) => {
   try{
    const contactService= new ContactService(MongoBD.client);
    const deletedCount= await contactService.deleteAll();
    return res.send({
        message:`${deletedCount} contacts were deleted successfully`,
    });
   }catch(error){
    return (new ApiError(500,"An error occurred while removing all contacts"))
   }
};

exports.findAllFavorite = async (req,res,next) =>{
   try{
    const contactService =new ContactService(MongoBD.client);
    const documents=await contactService.findFavorite();
    return res.send(documents);

   }catch(error){
    return next( new ApiError(500, "An error occured while retrieving favorite contacts"));
   }
};
exports.deleteFavorite= async(req,res,next)=>{
    try{
    const contactService= new ContactService(MongoBD.client);
    const document= await contactService.deleteFavorite(req.params.id);
    if(!document){
        return next(new ApiError(404,"Contact not found"));
    }
    return res.send({message:"contact was deleted favorite successfully"});
    }catch(error){
        return next(new ApiError(500,`could not delete contact with id=${req.params.id}`));
    }


}



