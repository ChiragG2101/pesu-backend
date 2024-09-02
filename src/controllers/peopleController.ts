import { Request, Response } from "express";
import People, { IPeople } from "../models/People";

export const getPeople = async (req: Request, res: Response): Promise<void> => {
  try {
    const peopleArray: IPeople[] = await People.find();
    if (peopleArray.length === 0) {
      res.status(404).json({ error: "No people found" });
      return;
    }
    res.json(peopleArray);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// export const createPeople = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const peopleArray: IPeople[] = req.body;
//     const newPeopleArray = await People.insertMany(peopleArray);
//     res.status(201).json(newPeopleArray);
//     return;
//   } catch (error) {
//     res.status(400).json({ error: "Invalid data" });
//   }
// };

export const updatePeople = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const peopleArray: IPeople[] = req.body;

    const updatePromises = peopleArray.map(async (person) => {
      return await People.findOneAndUpdate(
        { type: person.type }, // Find the document by type
        { $set: { count: person.count } }, // Update the count field
        { new: true, upsert: true } // Return the updated document, create if not found
      );
    });

    const updatedPeopleArray = await Promise.all(updatePromises);
    res.status(200).json(updatedPeopleArray);
    return;
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
};

// export const updatePeople = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const { count } = req.body;
//     const updatedPeople = await People.findByIdAndUpdate(
//       id,
//       { count },
//       { new: true }
//     );
//     if (!updatedPeople) {
//       res.status(404).json({ error: "People not found" });
//       return;
//     }
//     res.json(updatedPeople);
//   } catch (error) {
//     res.status(400).json({ error: "Invalid data" });
//   }
// };
