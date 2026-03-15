export async function checkBatteryOptimization() {
  if (!window.Capacitor || !Capacitor.Plugins.BatteryOptimization) return;

  const result = await Capacitor.Plugins.BatteryOptimization.isIgnoringBatteryOptimizations();

  // If NOT ignoring → battery optimization is ON → warn user
  if (!result.ignoring) {
    const msg =
      "Da bi podsjetnici radili pouzdano, potrebno je isključiti optimizaciju baterije za LifeKompas.\n\nOtvoriti postavke sada?";

    if (confirm(msg)) {
      await Capacitor.Plugins.BatteryOptimization.openBatteryOptimizationSettings();
    }
  }
}