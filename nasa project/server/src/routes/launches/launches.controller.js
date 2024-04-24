const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
} = require("../../model/launches.model");

const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  console.log(req.query);
  const { skip, limit } = getPagination(req.query);
  return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing required property" });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate))
    return res
      .status(400)
      .json({ status: "error", message: "Incorrect Date format" });
  await scheduleNewLaunch(launch);
  return res.status(201).json({ message: "Success", data: launch });
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const existLaunch = await existsLaunchWithId(launchId);
  if (!existLaunch)
    return res
      .status(404)
      .json({ status: "error", message: "No Launch found with this Id" });

  const aborted = await abortLaunchById(launchId);
  console.log("aborted1", aborted);
  if (!aborted)
    return res
      .status(400)
      .json({ status: "error", message: "launch not aborted" });

  return res.status(200).json({ status: "success", message: "Launch Deleted" });
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
