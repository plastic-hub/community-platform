import * as React from 'react'
import { Flex, Box } from 'rebass'
import { Link } from 'src/components/Links'
import TagsSelect from 'src/components/Tags/TagsSelect'
import { inject, observer } from 'mobx-react'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { UserStore } from 'src/stores/User/user.store'
import { Button } from 'src/components/Button'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import MoreContainer from 'src/components/MoreContainer/MoreContainer'
import HowToCard from 'src/components/HowToCard/HowToCard'
import Heading from 'src/components/Heading'
import { Loader } from 'src/components/Loader'
import { VirtualizedFlex } from 'src/components/VirtualizedFlex/VirtualizedFlex'

interface InjectedProps {
  howtoStore?: HowtoStore
  userStore?: UserStore
}

interface IState {
  isLoading: boolean
  // totalHowtoColumns: number
}

// First we use the @inject decorator to bind to the howtoStore state
@inject('howtoStore', 'userStore')
// Then we can use the observer component decorator to automatically tracks observables and re-renders on change
// (note 1, use ! to tell typescript that the store will exist (it's an injected prop))
// (note 2, mobx seems to behave more consistently when observables are referenced outside of render methods)
@observer
export class HowtoList extends React.Component<any, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      isLoading: true,
    }
  }
  get injected() {
    return this.props as InjectedProps
  }

  public render() {
    const { filteredHowtos, selectedTags } = this.props.howtoStore
    return (
      <>
        <Flex py={26}>
          <Heading medium bold txtcenter width={1} my={20}>
            Learn & share how to recycle, build and work with plastic
          </Heading>
        </Flex>
        <Flex
          flexWrap={'nowrap'}
          justifyContent={'space-between'}
          flexDirection={['column', 'column', 'row']}
        >
          <Flex width={[1, 1, 0.2]} mb={['10px', '10px', 0]}>
            <TagsSelect
              onChange={tags => this.props.howtoStore.updateSelectedTags(tags)}
              category="how-to"
              styleVariant="filter"
              placeholder="Filter by tags"
              relevantTagsItems={filteredHowtos}
            />
          </Flex>
          <Flex justifyContent={['flex-end', 'flex-end', 'auto']}>
            <Link
              width="100%"
              to={this.props.userStore!.user ? '/how-to/create' : 'sign-up'}
              mb={[3, 3, 0]}
            >
              <Button
                width="100%"
                variant={'primary'}
                translateY
                data-cy="create"
              >
                Create a How-to
              </Button>
            </Link>
          </Flex>
        </Flex>
        <React.Fragment>
          {filteredHowtos.length === 0 ? (
            <Flex>
              <Heading auxiliary txtcenter width={1}>
                {Object.keys(selectedTags).length === 0 ? (
                  <Loader />
                ) : (
                  'No how-tos to show'
                )}
              </Heading>
            </Flex>
          ) : (
            <Flex justifyContent={'center'} mx={-4}>
              <VirtualizedFlex
                data={filteredHowtos}
                renderItem={data => (
                  <Box px={4} py={4}>
                    <HowToCard howto={data} />
                  </Box>
                )}
              />
            </Flex>
          )}
          <Flex justifyContent={'center'} mt={20}>
            <Link to={'#'} style={{ visibility: 'hidden' }}>
              <Button variant={'secondary'} data-cy="more-how-tos">
                More how-tos
              </Button>
            </Link>
          </Flex>
          <MoreContainer m={'0 auto'} pt={60} pb={90}>
            <Flex alignItems={'center'} flexDirection={'column'} mt={5}>
              <Heading medium sx={{ textAlign: 'center' }}>
                Inspire the Precious Plastic world.
              </Heading>
              <Heading medium>Share your how-to!</Heading>
              <AuthWrapper>
                <Link to={'/how-to/create'}>
                  <Button variant="primary" mt={30}>
                    Create a how-to
                  </Button>
                </Link>
              </AuthWrapper>
            </Flex>
          </MoreContainer>
        </React.Fragment>
      </>
    )
  }
}
