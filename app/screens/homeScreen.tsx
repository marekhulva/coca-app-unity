import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { theme } from '../themes/theme'
import { useAppStore } from '../state/appStore'

export const HomeScreen: React.FC = () => {
  const { user, activities, incrementActivityCount } = useAppStore()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user.name}!</Text>
        </View>

        <Card variant="elevated" padding="lg" style={styles.statsCard}>
          <Text style={styles.cardTitle}>Today's Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.todayStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {activities.map((activity) => (
            <Card
              key={activity.id}
              variant="outlined"
              padding="md"
              style={styles.activityCard}
              onPress={() => incrementActivityCount(activity.id)}
            >
              <View style={styles.activityContent}>
                <View>
                  <Text style={styles.activityName}>{activity.name}</Text>
                  <Text style={styles.activityDescription}>
                    {activity.description}
                  </Text>
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{activity.count}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.buttonSection}>
          <Button
            title="Start New Activity"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => console.log('Start new activity')}
          />
          <Button
            title="View All Stats"
            variant="outline"
            size="lg"
            fullWidth
            onPress={() => console.log('View all stats')}
            style={styles.secondaryButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.secondary,
  },
  
  scrollContent: {
    padding: theme.spacing.md,
  },
  
  header: {
    marginBottom: theme.spacing.lg,
  },
  
  welcomeText: {
    fontSize: theme.font.size.lg,
    color: theme.color.text.secondary,
  },
  
  userName: {
    fontSize: theme.font.size.xxl,
    fontWeight: theme.font.weight.bold,
    color: theme.color.text.primary,
  },
  
  statsCard: {
    marginBottom: theme.spacing.lg,
  },
  
  cardTitle: {
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.md,
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statValue: {
    fontSize: theme.font.size.xxxl,
    fontWeight: theme.font.weight.bold,
    color: theme.color.primary,
  },
  
  statLabel: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
    marginTop: theme.spacing.xs,
  },
  
  section: {
    marginBottom: theme.spacing.lg,
  },
  
  sectionTitle: {
    fontSize: theme.font.size.xl,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.md,
  },
  
  activityCard: {
    marginBottom: theme.spacing.sm,
  },
  
  activityContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  activityName: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
  },
  
  activityDescription: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
    marginTop: theme.spacing.xs,
  },
  
  countBadge: {
    backgroundColor: theme.color.primary,
    borderRadius: theme.radius.full,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  countText: {
    color: theme.color.text.inverse,
    fontWeight: theme.font.weight.bold,
    fontSize: theme.font.size.md,
  },
  
  buttonSection: {
    marginTop: theme.spacing.xl,
  },
  
  secondaryButton: {
    marginTop: theme.spacing.sm,
  },
})