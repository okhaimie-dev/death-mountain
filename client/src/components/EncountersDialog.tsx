import { Box, Dialog, Divider, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { calculateLevel } from '@/utils/game';

interface EncountersDialogProps {
  open: boolean;
  onClose: () => void;
  encounters: any[];
}

const EncountersDialog = ({ open, onClose, encounters }: EncountersDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      slotProps={{
        paper: {
          sx: {
            background: 'rgba(0, 0, 0, 1)',
            border: '1px solid #80FF00',
            maxWidth: '100dvw',
            borderRadius: '5px',
            margin: '4px'
          }
        }
      }}
    >
      <Box sx={{ p: 2, width: '800px', maxWidth: '100%', boxSizing: 'border-box' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" color="primary">Encounter Table</Typography>
          <CloseIcon htmlColor='#FFF' sx={{ fontSize: '24px', cursor: 'pointer' }} onClick={onClose} />
        </Box>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 1 }} />

        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(0, 0, 0, 1)', zIndex: 8 }}>
              <tr>
                <th style={{ padding: '8px', borderBottom: '1px solid #80FF00', textAlign: 'left', fontSize: '0.775rem' }}>XP</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #80FF00', textAlign: 'left', fontSize: '0.775rem' }}>Type</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #80FF00', textAlign: 'center', fontSize: '0.775rem' }}>Encounter</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #80FF00', textAlign: 'left', fontSize: '0.775rem' }}>HP</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #80FF00', textAlign: 'left', fontSize: '0.775rem' }}>Type</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #80FF00', textAlign: 'center', fontSize: '0.775rem' }}>Location</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #80FF00', textAlign: 'center', fontSize: '0.775rem' }}>Dodge</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #80FF00', textAlign: 'center', fontSize: '0.775rem' }}>Crit</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #80FF00', textAlign: 'left', fontSize: '0.775rem' }}>Next</th>
              </tr>
            </thead>
            <tbody>
              {encounters.map((encounter, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px', borderBottom: '1px solid rgba(128, 255, 0, 0.2)' }}>
                    <Typography color="primary">{encounter.xp}</Typography>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid rgba(128, 255, 0, 0.2)' }}>
                    <Typography color="primary" sx={{ textTransform: 'uppercase' }}>{encounter.encounter}</Typography>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid rgba(128, 255, 0, 0.2)' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {encounter.encounter !== 'Discovery' && (
                        <>
                          <Typography color="primary">PWR {encounter.power}</Typography>
                          <Typography color="primary" sx={{ fontSize: '0.8rem', color: '#EDCF33' }}>
                            T{encounter.tier} L{encounter.level}
                          </Typography>
                        </>
                      )}
                      {encounter.type === 'Health' && (
                        <Typography color="primary">{encounter.tier} ❤️</Typography>
                      )}
                      {encounter.type === 'Gold' && (
                        <Typography color="primary">{encounter.tier} 💰</Typography>
                      )}
                      {encounter.type === 'Loot' && (
                        <Typography color="primary">{encounter.tier} 🎒</Typography>
                      )}
                    </Box>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid rgba(128, 255, 0, 0.2)' }}>
                    <Typography color="primary">{encounter.health || '-'}</Typography>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid rgba(128, 255, 0, 0.2)' }}>
                    <Typography color="primary" sx={{ textTransform: 'uppercase' }}>
                      {encounter.encounter === 'Beast' ? (
                        encounter.type === 'Blade' ? 'Hunter' :
                          encounter.type === 'Bludgeon' ? 'Brute' :
                            'Magical'
                      ) : encounter.type}
                    </Typography>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid rgba(128, 255, 0, 0.2)', textAlign: 'center' }}>
                    <Typography color="primary" sx={{ textTransform: 'uppercase' }}>
                      {encounter.location || '-'}
                    </Typography>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid rgba(128, 255, 0, 0.2)', textAlign: 'center' }}>
                    <Typography color="primary">
                      {encounter.dodgeRoll || '-'}
                      {encounter.dodgeRoll && (
                        <Typography component="span" color="primary" sx={{ fontSize: '0.8rem', ml: 0.5 }}>
                          {encounter.encounter === 'Beast' ? 'WIS' : 'INT'}
                        </Typography>
                      )}
                    </Typography>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid rgba(128, 255, 0, 0.2)', textAlign: 'center' }}>
                    <Typography color="primary">
                      {encounter.isCritical ? 'Yes' : 'No'}
                    </Typography>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid rgba(128, 255, 0, 0.2)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography color="primary">{encounter.nextXp}</Typography>
                      {calculateLevel(encounter.nextXp) > calculateLevel(encounter.xp) && (
                        <Typography color="#EDCF33" sx={{ fontSize: '0.9rem', mb: 0.5, letterSpacing: '-0.2em' }}>
                          {'↑'.repeat(calculateLevel(encounter.nextXp) - calculateLevel(encounter.xp))}
                        </Typography>
                      )}
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EncountersDialog; 