import { Request, Response } from "express";
import People, { IPeople } from "../models/people";

const DTO = (people: IPeople[]) => {
  return people.map(({ type, count }) => ({ type, count }));
};

export const getPeople = async (req: Request, res: Response): Promise<void> => {
  try {
    const people: IPeople[] = await People.find();
    if (people.length === 0) {
      res.status(404).json({ error: "No people found" });
      return;
    }
    const totalCount = people.reduce((sum, person) => sum + person.count, 0);
    res.json({ totalCount, people: DTO(people) });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createPeople = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const peopleArray: IPeople[] = req.body;

    const updatePromises = peopleArray.map(async (person) => {
      return await People.findOneAndUpdate(
        { type: person.type },
        { $set: { count: person.count } },
        { new: true, upsert: true }
      );
    });

    const updatedPeopleArray = await Promise.all(updatePromises);
    const totalCount = updatedPeopleArray.reduce(
      (sum, person) => sum + person.count,
      0
    );
    res.status(200).json({ totalCount, people: DTO(updatedPeopleArray) });
    return;
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
};
