import { Router, type Request, type Response } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


router.post('/', (req: Request, res: Response) => {
    try {
      const cityName = req.body.cityName;
  
      WeatherService.getWeatherForCity(cityName).then((data) => {
        HistoryService.addCity(cityName);
        res.json(data);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
router.get('/history', async (_req: Request, res: Response) => {
    HistoryService.getCities()
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });

router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    HistoryService.deleteCity(id);
    res.sendStatus(200)
    console.log(`${id} Deleted`);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;