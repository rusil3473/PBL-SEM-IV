const express=require("express")

const app=express();
const port=5000;

app.use(express.json())

app.post("/complie",async(req,res)=>{
    try {
    console.log("Done");
    return res.status(200).send({message:"done"})       
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Error while compiling"});
    }
})



app.listen(port,()=>{
    console.log(`Listing to port ${port}`)
})