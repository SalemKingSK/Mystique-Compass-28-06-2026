import { Router } from "express";

const router = Router();

router.get("/biography", async (req, res) => {
  const name = req.query.name as string;
  if (!name) {
    res.status(400).json({ found: false, error: "name query param required" });
    return;
  }

  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`;
    const searchResp = await fetch(searchUrl);
    const searchData = await searchResp.json() as any;

    const results = searchData?.query?.search ?? [];
    if (!results.length) {
      res.json({ found: false });
      return;
    }

    const pageId = results[0].pageid;
    const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=revisions|categories&rvprop=content&rvslots=main&format=json&origin=*`;
    const extractResp = await fetch(extractUrl);
    const extractData = await extractResp.json() as any;

    const page = extractData?.query?.pages?.[pageId];
    if (!page) {
      res.json({ found: false });
      return;
    }

    const title = page.title as string;
    const content = page?.revisions?.[0]?.slots?.main?.["*"] as string ?? "";

    const birthMatch = content.match(/\|\s*birth_date\s*=.*?(\d{1,2})\s*[|,]\s*(\d{1,2})\s*[|,]\s*(\d{4})/);
    const isoMatch = content.match(/birth_date\s*=.*?(\d{4})-(\d{1,2})-(\d{1,2})/);
    const yearMatch = content.match(/born.*?(\d{4})/i);
    const categoryText = page?.categories?.map((c: any) => c.title ?? "").join(" ") ?? "";

    let birthYear: number | null = null;
    let birthMonth: number | null = null;
    let birthDay: number | null = null;

    if (isoMatch) {
      birthYear = parseInt(isoMatch[1]);
      birthMonth = parseInt(isoMatch[2]);
      birthDay = parseInt(isoMatch[3]);
    } else if (birthMatch) {
      const [, d, m, y] = birthMatch;
      birthDay = parseInt(d);
      birthMonth = parseInt(m);
      birthYear = parseInt(y);
    } else {
      const dfBirth = content.match(/\{\{birth date(?:\s*and age)?\|(\d{4})\|(\d{1,2})\|(\d{1,2})/i);
      if (dfBirth) {
        birthYear = parseInt(dfBirth[1]);
        birthMonth = parseInt(dfBirth[2]);
        birthDay = parseInt(dfBirth[3]);
      } else if (yearMatch) {
        birthYear = parseInt(yearMatch[1]);
        birthMonth = 1;
        birthDay = 1;
      }
    }

    const genderMale = /\b(he|his|him|actor|king|emperor|pope|prince|duke|lord|mr\.)\b/i.test(content);
    const genderFemale = /\b(she|her|hers|actress|queen|empress|princess|duchess|lady|mrs\.)\b/i.test(content);
    const gender = genderFemale ? "female" : "male";

    const descriptionMatch = content.match(/'''[^']+'''\s*\(([^)]{5,80})\)/);
    const description = descriptionMatch ? descriptionMatch[1] : "";

    if (!birthYear) {
      res.json({ found: false, title });
      return;
    }

    res.json({
      found: true,
      title,
      description,
      birthYear,
      birthMonth,
      birthDay,
      gender,
      wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
    });
  } catch (err) {
    req.log?.error({ err }, "Biography fetch error");
    res.status(500).json({ found: false, error: "internal error" });
  }
});

export default router;
