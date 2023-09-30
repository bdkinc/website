import { packages } from "./page";

function MSPPackages() {
  return (
    <div id="essentials-with-addons">
      <h2 className="text-3xl">MSP Packages</h2>
      <div className={`grid grid-cols-${Object.keys(packages).length} gap-8`}>
        {Object.keys(packages).map((key) => (
          <div key={key}>
            <div className="capitalize font-heading font-semibold text-lg leading-loose mb-2">
              {key}
            </div>
            <div className={!Array.isArray(packages[key]) && "space-y-4"}>
              {Array.isArray(packages[key]) ? (
                <div className="border p-2">
                  <span>{packages[key].join(", ")}</span>
                </div>
              ) : (
                Object.keys(packages[key]).map((pack) => (
                  <div
                    key={pack}
                    className="border dark:bg-slate-800 dark:border-slate-900 p-4"
                  >
                    <div className="px-4">
                      <div className="capitalize font-heading font-semibold leading-loose">
                        {pack}
                      </div>
                      <div
                        className={
                          !Array.isArray(packages[key][pack]) && "space-y-2"
                        }
                      >
                        {Array.isArray(packages[key][pack]) ? (
                          <span>{packages[key][pack].join(", ")}</span>
                        ) : (
                          Object.keys(packages[key][pack]).map((level) => (
                            <div key={level}>
                              <div className="capitalize font-semibold">
                                {level}
                              </div>
                              <div>
                                {Array.isArray(packages[key][pack][level]) ? (
                                  <span>
                                    {packages[key][pack][level].join(", ")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MSPPackages;
